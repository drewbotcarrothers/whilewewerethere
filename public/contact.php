<?php
declare(strict_types=1);

/**
 * Contact form handler for whilewewerethere.com (Hostinger, PHP mail()).
 * Accepts POST from /contact/, sends mail to the site inbox, then redirects back.
 * Hostinger only relays mail() From an existing mailbox on the domain.
 */

const TO_EMAIL = 'contact@whilewewerethere.com';
// Hostinger only relays mail() From an existing mailbox on the domain.
const FROM_EMAIL = 'contact@whilewewerethere.com';
const FROM_NAME = 'While We Were There';
const REDIRECT = '/contact/';
const RATE_LIMIT = 5;
const RATE_WINDOW = 3600;

function redirect_status(string $status): never
{
    header('Location: ' . REDIRECT . '?' . http_build_query(['status' => $status]), true, 303);
    exit;
}

function field_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function field_slice(string $value, int $max): string
{
    if (field_length($value) <= $max) {
        return $value;
    }
    return function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
}

function mime_header(string $text): string
{
    if (function_exists('mb_encode_mimeheader')) {
        return mb_encode_mimeheader($text, 'UTF-8', 'B', "\r\n");
    }
    return '=?UTF-8?B?' . base64_encode($text) . '?=';
}

/** Trim a single-line field and reject header-injection attempts. */
function clean_line(string $value, int $max): ?string
{
    $value = trim($value);
    if (preg_match('/[\r\n]/', $value) === 1) {
        return null;
    }
    return field_slice($value, $max);
}

function rate_limited(string $ip): bool
{
    $file = sys_get_temp_dir() . '/wwwt-contact-rate.json';
    $handle = fopen($file, 'c+');
    if ($handle === false) {
        return false;
    }
    flock($handle, LOCK_EX);
    $raw = stream_get_contents($handle);
    $data = json_decode(is_string($raw) ? $raw : '[]', true);
    if (!is_array($data)) {
        $data = [];
    }
    $now = time();
    $cutoff = $now - RATE_WINDOW;
    $key = hash('sha256', $ip);
    $times = [];
    foreach ($data[$key] ?? [] as $stamp) {
        if (is_int($stamp) && $stamp >= $cutoff) {
            $times[] = $stamp;
        }
    }
    if (count($times) >= RATE_LIMIT) {
        flock($handle, LOCK_UN);
        fclose($handle);
        return true;
    }
    $times[] = $now;
    $data[$key] = $times;
    foreach ($data as $entryKey => $stamps) {
        $kept = [];
        foreach ((array) $stamps as $stamp) {
            if (is_int($stamp) && $stamp >= $cutoff) {
                $kept[] = $stamp;
            }
        }
        if ($kept === []) {
            unset($data[$entryKey]);
        } else {
            $data[$entryKey] = $kept;
        }
    }
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($data));
    flock($handle, LOCK_UN);
    fclose($handle);
    return false;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: ' . REDIRECT, true, 303);
    exit;
}

// Honeypot: bots that fill it get a fake success and no email.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    redirect_status('sent');
}

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
if (rate_limited($ip)) {
    redirect_status('error');
}

$name = clean_line((string) ($_POST['name'] ?? ''), 200);
$email = clean_line((string) ($_POST['email'] ?? ''), 200);
$subject = clean_line((string) ($_POST['subject'] ?? ''), 200);
$message = trim((string) ($_POST['message'] ?? ''));
$message = field_slice($message, 8000);

if ($name === null || $email === null || $subject === null) {
    redirect_status('error');
}
if ($name === '' || $email === '' || $message === '') {
    redirect_status('error');
}
if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    redirect_status('error');
}

$mailSubject = 'Website: ' . ($subject !== '' ? $subject : 'Message from the website');
$encodedSubject = mime_header($mailSubject);
$encodedVisitor = mime_header($name);

$body = "A message from the While We Were There contact form.\n\n"
    . 'Name: ' . $name . "\n"
    . 'Email: ' . $email . "\n"
    . 'Subject: ' . ($subject !== '' ? $subject : '(none)') . "\n\n"
    . $message . "\n";

$headers = implode("\r\n", [
    'From: ' . FROM_NAME . ' <' . FROM_EMAIL . '>',
    'Reply-To: ' . $encodedVisitor . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: whilewewerethere-contact',
]);

// Hostinger typically needs -f set to the domain mailbox; some hosts reject -f, so fall back.
$sent = @mail(TO_EMAIL, $encodedSubject, $body, $headers, '-f' . FROM_EMAIL);
if (!$sent) {
    $sent = @mail(TO_EMAIL, $encodedSubject, $body, $headers);
}
if (!$sent) {
    error_log('contact.php: mail() failed: ' . json_encode(error_get_last()));
}
redirect_status($sent ? 'sent' : 'error');
