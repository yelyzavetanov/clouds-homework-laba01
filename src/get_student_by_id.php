<?php
// get_student_by_id.php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host = 'localhost';
$user = 'yelz';
$pass = 'твій_пароль';
$db   = 'lab_auth';

$mysqli = new mysqli($host, $user, $pass, $db);
$mysqli->set_charset('utf8mb4');

// Якщо форма не відправлена – показуємо інпут
if (!isset($_GET['id'])) {
    ?>
    <form style='width: 100%; padding-top: 200px; text-align: center;' method="GET">
        <label for="id">Введіть ID студента:</label>
        <input type="number" name="id" id="id" required>
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
$id = $_GET['id'];

if (!ctype_digit($id)) {
    echo "Невірний формат id";
    exit;
}

try {
    $stmt = $mysqli->prepare("SELECT st_name FROM students WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->bind_result($st_name);

    if ($stmt->fetch()) {
        echo "ПІБ: " . htmlspecialchars($st_name);
    } else {
        echo "Студент з id={$id} не знайдений";
    }

    $stmt->close();
} catch (mysqli_sql_exception $e) {
    echo "<pre>Database error: " . htmlspecialchars($e->getMessage()) . "</pre>";
}

$mysqli->close();
