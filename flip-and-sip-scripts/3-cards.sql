CREATE TABLE cards (
    card_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    card_title TEXT NOT NULL,
    card_desc text not null,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    author INTEGER references users(id)
);