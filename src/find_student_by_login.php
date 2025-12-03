<?php
// find_student_by_login.php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host = 'localhost';
$user = 'yelz';
$pass = 'твій_пароль';
$db   = 'lab_auth';

$mysqli = new mysqli($host, $user, $pass, $db);
$mysqli->set_charset('utf8mb4');

// Якщо форма ще не заповнена → показуємо інпут
if (!isset($_GET['login']) || $_GET['login'] === '') {
    ?>
    <form method="GET">
        <label for="login">Введіть login студента:</label>
        <input type="text" name="login" id="login" required>
        <button type="submit">Знайти</button>
    </form>
    <style>
        form {
            width: 100%;
            font-size: 20px;
            display: flex;
            margin-top: 200px;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 20px;
        }
        input {
            padding: 5px;
            font-size: 16px;
        }
    </style>
    <?php
    exit;
}

// Далі — твоя логіка
$login = $_GET['login'];

if (mb_strlen($login) > 100) {
    echo "Login занадто довгий";
    exit;
}

try {
// safe code:
//     $stmt = $mysqli->prepare("SELECT id, st_name FROM students WHERE login = ?");
//     $stmt->bind_param('s', $login);
//     $stmt->execute();
//     $res = $stmt->get_result();

// not safe code:
    $query = "SELECT id, st_name FROM students WHERE login = '$login'";
    if ($mysqli->multi_query($query)) {
        if ($res = $mysqli->store_result()) {
            if ($row = $res->fetch_assoc()) {
                echo "id: " . htmlspecialchars($row['id']) . "<br>";
                echo "ПІБ: " . htmlspecialchars($row['st_name']);
            } else {
                echo "Студента з login=" . htmlspecialchars($login) . " не знайдено";
            }
            $res->free();
        }
        while ($mysqli->more_results() && $mysqli->next_result()) {
            if ($extra = $mysqli->store_result()) {
                $extra->free();
            }
        }
    }

    if ($row = $res->fetch_assoc()) {
        echo "id: " . htmlspecialchars($row['id']) . "<br>";
        echo "ПІБ: " . htmlspecialchars($row['st_name']);
    } else {
        echo "Студента з login=" . htmlspecialchars($login) . " не знайдено";
    }

    $stmt->close();
} catch (mysqli_sql_exception $e) {
    echo "<pre>Database error: " . htmlspecialchars($e->getMessage()) . "</pre>";
}

$mysqli->close();
