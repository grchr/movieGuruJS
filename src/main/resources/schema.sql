drop all OBJECTS;

create table User (
  user_id int AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  email VARCHAR(250) NOT NULL,
  password VARCHAR(250) NOT NULL
);

create table Bookmark (
  bookmark_id int AUTO_INCREMENT PRIMARY KEY,
  imdb_id VARCHAR(250) NOT NULL,
  title VARCHAR(250) NOT NULL,
  user int NOT NULL
);
commit;