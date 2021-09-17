process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

const book = {
    "isbn": "0691161518",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Power in video Games",
    "year": 2017
}

const books = {
    "books": [book]
}

beforeEach(async function () {
    await db.query(`
        INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
        VALUES ('0691161518', 'http://a.co/eobPtX2', 'Matthew Lane', 'english', 264, 'Princeton University Press', 'Power-Up: Unlocking the Hidden Power in video Games', 2017)`);
})

describe('GET /books', function () {
    test("Returns all books", async function () {
        const response = await request(app)
            .get(`/books`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(books)
        
    })
})

describe('GET /book by isbn', function () {
    test("Returns book by isbn", async function () {
        const response = await request(app)
            .get(`/books/0691161518`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({book})
    })
})

describe('POST /book', function(){
    test("Can Post a valid book", async function(){
        const leaves = {
            "isbn": "0375703764",
            "amazon_url": "https://www.amazon.com/House-Leaves-Mark-Z-Danielewski/dp/0375703764",
            "author": "Mark Z Danielewski",
            "language": "english",
            "pages": 709,
            "publisher": "Pantheon; 2nd edition (March 7, 2000)",
            "title": "House Of Leaves",
            "year": 2000
        }
        const response = await request(app)
            .post(`/books`)
            .send(leaves);
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({book: leaves})
    })

    test("Fails if book is invalid", async function(){
        let leaves = {
            "amazon_url": "https://www.amazon.com/House-Leaves-Mark-Z-Danielewski/dp/0375703764",
            "author": "Mark Z Danielewski",
            "language": "english",
            "pages": 709,
            "publisher": "Pantheon; 2nd edition (March 7, 2000)",
            "title": "House Of Leaves",
            "year": 2000
        }
        let response = await request(app)
            .post(`/books`)
            .send(leaves);
        expect(response.statusCode).toBe(400);
        leaves = {
            "isbn": "0375703764",
            "amazon_url": "https://www.amazon.com/House-Leaves-Mark-Z-Danielewski/dp/0375703764",
            "author": 12,
            "language": "english",
            "pages": 709,
            "publisher": "Pantheon; 2nd edition (March 7, 2000)",
            "title": "House Of Leaves",
            "year": 2000
        }
        response = await request(app)
            .post(`/books`)
            .send(leaves);
        expect(response.statusCode).toBe(400);
    })
})

describe('PUT /books/:isbn', function(){
    test("Can edit a existing book with valid values", async function(){
        const data = {
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Jacob Stevens",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Power in video Games",
            "year": 2017
        }
        const response = await request(app)
            .put(`/books/0691161518`)
            .send(data);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({book: data})
    })

    test("Edit fails with invalid data", async function(){
        let data = {
            "isbn": 12,
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Jacob Stevens",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Power in video Games",
            "year": 2017
        }
        let response = await request(app)
            .put(`/books/0691161518`)
            .send(data);
        expect(response.statusCode).toBe(400);
    })

    test("Edit fails with missing data", async function(){
        let data = {
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Power in video Games",
            "year": 2017
        }
        let response = await request(app)
            .put(`/books/0691161518`)
            .send(data);
        expect(response.statusCode).toBe(400);
    })
})
afterEach(async function () {
    await db.query("DELETE FROM books");
});

afterAll(async function () {
    await db.end();
});