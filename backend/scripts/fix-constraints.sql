-- Arreglar constraints de posts
ALTER TABLE posts DROP CONSTRAINT IF EXISTS title_length;
ALTER TABLE posts DROP CONSTRAINT IF EXISTS content_length;

ALTER TABLE posts ADD CONSTRAINT title_length CHECK (char_length(title) >= 3 AND char_length(title) <= 500);
ALTER TABLE posts ADD CONSTRAINT content_length CHECK (char_length(content) >= 3 AND char_length(content) <= 10000);
