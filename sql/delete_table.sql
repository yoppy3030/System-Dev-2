-- 'sd2db ' スキーマに属する全てのテーブルの名前を取得し、ドロップテーブルのクエリを準備
SET @tables = NULL;
SELECT GROUP_CONCAT(table_schema, '.', table_name)
INTO @tables
FROM information_schema.tables
WHERE table_schema = 'sd2db ';

-- 取得したテーブルの名前を使用してドロップテーブルのクエリを構築
SET @tables = CONCAT('DROP TABLE ', @tables);
-- クエリを準備
PREPARE stmt FROM @tables;
-- クエリを実行
EXECUTE stmt;
-- クエリを解放
DEALLOCATE PREPARE stmt;

-- 'sd2db ' スキーマに属する全てのテーブルの名前を表示
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'sd2db ';