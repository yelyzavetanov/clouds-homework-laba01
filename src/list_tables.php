<?php
// list_tables.php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); // корисно в dev

$host = 'localhost';
$user = 'yelz';
$pass = 'твій_пароль';
$db   = 'lab_auth';

$mysqli = new mysqli($host, $user, $pass, $db);
$mysqli->set_charset('utf8mb4');

try {
    // students
    $res = $mysqli->query("SELECT id, login, st_name, group_name, year FROM students");
    echo "<h2>Students</h2><table border='1'><tr><th>id</th><th>login</th><th>st_name</th><th>group</th><th>year</th></tr>";
    while ($row = $res->fetch_assoc()) {
        echo "<tr><td>{$row['id']}</td><td>{$row['login']}</td><td>{$row['st_name']}</td><td>{$row['group_name']}</td><td>{$row['year']}</td></tr>";
    }
    echo "</table>";

    // users
    $res = $mysqli->query("SELECT id, email, phone FROM users");
    echo "<h2>Users</h2><table border='1'><tr><th>id</th><th>email</th><th>phone</th></tr>";
    while ($row = $res->fetch_assoc()) {
        echo "<tr><td>{$row['id']}</td><td>{$row['email']}</td><td>{$row['phone']}</td></tr>";
    }
    echo "</table>";

} catch (mysqli_sql_exception $e) {
    // У development можна вивести помилку, у production — логувати
    echo "<pre>Database error: " . htmlspecialchars($e->getMessage()) . "</pre>";
}

$mysqli->close();
