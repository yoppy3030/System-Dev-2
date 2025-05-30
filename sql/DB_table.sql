CREATE TABLE Accounts (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL COMMENT 'ユーザーの名前',
    Password VARCHAR(255) NOT NULL COMMENT 'ユーザーのパスワード',
    Email VARCHAR(100) NOT NULL UNIQUE COMMENT 'ユーザーのメールアドレス',
    Country VARCHAR(50) NOT NULL COMMENT 'ユーザーの国',
    Current_location VARCHAR(100) NOT NULL COMMENT 'ユーザーの現在の所在地',
    UserType ENUM('Tourist', 'International Student', 'Professional' , 'other') NOT NULL COMMENT 'ユーザーのタイプ',
    RegistrationDate DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
    LastLogin DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '最終ログイン日時',
    Prefecture VARCHAR(50) COMMENT 'ユーザーの都道府県'
);

SHOW COLUMNS FROM Accounts;