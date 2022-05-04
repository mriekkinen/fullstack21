CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);

insert into blogs (author, title, url) values (
  'Dan Abramov',
  'Writing Resilient Components',
  'https://overreacted.io/writing-resilient-components/'
);

insert into blogs (author, title, url) values (
  'Martin Fowler',
  'Is High Quality Software Worth the Cost?',
  'https://martinfowler.com/articles/is-quality-worth-cost.html'
);

insert into blogs (author, title, url) values (
  'Robert C. Martin',
  'FP vs. OO List Processing',
  'https://blog.cleancoder.com/uncle-bob/2018/12/17/FPvsOO-List-processing.html'
);
