-- db を作成するためのSQLスクリプト
-- このスクリプトは、データベースを削除してから再作成します。
DROP DATABASE IF EXISTS sd2db;
CREATE DATABASE sd2db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sd2db;

-- TABLE : users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL COMMENT 'ユーザーの名前',
    password VARCHAR(255) NOT NULL COMMENT 'ユーザーのパスワード',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT 'ユーザーのメールアドレス',
    country VARCHAR(50) NOT NULL COMMENT 'ユーザーの国',
    activity ENUM('Tourist', 'International Student', 'Professional', 'other') NOT NULL COMMENT 'ユーザーのタイプ',
    registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
    last_login DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最終ログイン日時',
    location VARCHAR(50) DEFAULT NULL COMMENT 'ユーザーの都道府県',
    bio TEXT DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT './img/default-avatar.jpg' COMMENT 'プロフィール画像のパス'
);

-- TABLE : posts
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT DEFAULT NULL,
    image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TABLE : comments （サポートする回答のネスト）)
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id INT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- TABLE : likes (投稿とコメント用)
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    target_id INT NOT NULL, -- ID コメントまたは投稿
    target_type ENUM('post', 'comment') NOT NULL,
    is_like TINYINT(1) NOT NULL, -- 1 = like, 0 = dislike
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY user_target_unique (user_id, target_id, target_type)
);

-- TABLE : contacts (ソーシャルメディアリンク)
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    link VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
