/* CREATE DATABASE IF NOT EXISTS SDC */

/* USE SDC */

CREATE TABLE questions(
  question_id integer NOT NULL DEFAULT 0,
  question_body text NOT NULL,
  question_date double precision,
  asker_name text NOT NULL,
  asker_email text NOT NULL,
  reported boolean NOT NULL DEFAULT false,
  question_helpfulness integer NOT NULL DEFAULT 0,
  product_id integer NOT NULL,
  PRIMARY KEY(question_id)
);

/* Table 'answers' */
CREATE TABLE answers(
  answer_id integer NOT NULL,
  answer_date double precision,
  answer_body text NOT NULL,
  answerer_name text NOT NULL,
  answerer_email text NOT NULL,
  reported boolean NOT NULL,
  answer_helpfulness integer DEFAULT 0,
  question_id integer NOT NULL,
  PRIMARY KEY(answer_id)
);

/* Table 'photos' */
CREATE TABLE photos(
  photo_id integer NOT NULL,
  answer_id integer NOT NULL,
  url text NOT NULL,
  PRIMARY KEY(photo_id)
);

/* Create relation to Questions table using question_id as a foreign key */
ALTER TABLE answers
  ADD CONSTRAINT questions_answers
    FOREIGN KEY (question_id) REFERENCES questions (question_id);

/* Create relation to Answers table using answer_id as a foreign key */
ALTER TABLE photos
  ADD CONSTRAINT answers_photos
    FOREIGN KEY (answer_id) REFERENCES answers (answer_id);

/* Copy data to tables */
-- id, product_id, body, date_written, asker_name, asker_email, reported, helpful
COPY questions (question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
  FROM '/Users/eric/HackReactor/sdc/qa-api/csv/questions.csv'
    DELIMITER ','
    CSV HEADER;

-- id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful
COPY answers (answer_id, question_id, answer_body, answer_date, answerer_name, answerer_email, reported, answer_helpfulness)
  FROM '/Users/eric/HackReactor/sdc/qa-api/csv/answers.csv'
    DELIMITER ','
    CSV HEADER;

COPY photos (photo_id, answer_id, url)
  FROM '/Users/eric/HackReactor/sdc/qa-api/csv/answers_photos.csv'
    DELIMITER ','
    CSV HEADER;



