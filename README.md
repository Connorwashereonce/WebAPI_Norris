The Chronicles of Middle-earth's Grand Saga
This is a full-stack RESTful web application themed around Lord of the Rings. It allows users to manage characters (Hero), groups (Team), and missions (Quest).

The backend (Spring Boot) uses a 3-layered architecture and JPA to handle data, including one-to-many (Team to Hero) and many-to-many (Hero to Quest) relationships. It exposes a RESTful API for all CRUD operations.

The frontend (HTML, CSS, JS) provides an interactive interface to interact with these features.

To run, start the Spring Boot backend, then open index.html in your browser.
