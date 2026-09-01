CREATE TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);

INSERT INTO blogs (author, url, title, likes) VALUES ('John Smith', 'http://example.com/blog1', 'My First Blog', 3);
INSERT INTO blogs (author, url, title, likes) VALUES ('Harry Styles', 'http://example.com/blog2', 'Learning Postgres', 7);
