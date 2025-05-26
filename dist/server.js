"use strict";
/* Copyright (c) 2021-25 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_process_1 = __importDefault(require("node:process"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
/**
 * Start a game server using the given arguments.
 *
 * PS4 instructions: you are advised *not* to modify this file.
 *
 * Command-line usage:
 *     npm start PORT
 * where:
 *
 *   - PORT is an integer that specifies the server's listening port number,
 *     0 specifies that a random unused port will be automatically chosen.
 *   - FILENAME is the path to a valid board file, which will be loaded as
 *     the starting game board.
 *
 * For example, to start a web server on a randomly-chosen port using the
 * board in `boards/hearts.txt`:
 *     npm start 0 boards/hearts.txt
 *
 * @throws Error if an error occurs parsing a file or starting a server
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const [portString] = node_process_1.default.argv.slice(1); // skip the first two arguments 
        // (argv[0] is node executable file, argv[1] is this script)
        if (portString === undefined) {
            throw new Error('missing PORT');
        }
        const port = parseInt(portString);
        if (isNaN(port) || port < 0) {
            throw new Error('invalid PORT');
        }
        const driver = neo4j_driver_1.default.driver('neo4j://localhost', neo4j_driver_1.default.auth.basic('neo4j', 'password'));
        const server = new WebServer(port, driver);
        yield server.start();
    });
}
/**
 * HTTP web game server.
 */
class WebServer {
    /**
     * Make a new web game server using board that listens for connections on port.
     *
     * @param board shared game board
     * @param requestedPort server port number
     */
    constructor(requestedPort, driver) {
        this.requestedPort = requestedPort;
        this.driver = driver;
        this.app = (0, express_1.default)();
        this.app.use((request, response, next) => {
            // allow requests from web pages hosted anywhere
            response.set('Access-Control-Allow-Origin', '*');
            next();
        });
        /*
         * GET /look/<playerId>
         * playerId must be a nonempty string of alphanumeric or underscore characters
         *
         * Response is the board state from playerId's perspective, as described in the ps4 handout.
         */
        this.app.get('/likePost/:postID/:userID', (request, response) => __awaiter(this, void 0, void 0, function* () {
            const { postID, userID } = request.params;
            (0, node_assert_1.default)(postID);
            /**
            const boardState = await look(this.board, playerId);
            response
            .status(StatusCodes.OK) // 200
            .type('text')
            .send(boardState);
            */
        }));
        /*
         * GET /look/<playerId>
         * playerId must be a nonempty string of alphanumeric or underscore characters
         *
         * Response is the board state from playerId's perspective, as described in the ps4 handout.
         */
        this.app.get('/likeStory/:storyID/:userID', (request, response) => __awaiter(this, void 0, void 0, function* () {
            const { storyID, userID } = request.params;
            (0, node_assert_1.default)(storyID);
            /**
            const boardState = await look(this.board, playerId);
            response
            .status(StatusCodes.OK) // 200
            .type('text')
            .send(boardState);
            */
        }));
        /*
         * GET /look/<playerId>
         * playerId must be a nonempty string of alphanumeric or underscore characters
         *
         * Response is the board state from playerId's perspective, as described in the ps4 handout.
         */
        this.app.get('/requestFollow/:requesterID/:userID', (request, response) => __awaiter(this, void 0, void 0, function* () {
            const { requesterID, userID } = request.params;
            (0, node_assert_1.default)(requesterID);
            /**
            const boardState = await look(this.board, playerId);
            response
            .status(StatusCodes.OK) // 200
            .type('text')
            .send(boardState);
            */
        }));
        /*
         * GET /look/<playerId>
         * playerId must be a nonempty string of alphanumeric or underscore characters
         *
         * Response is the board state from playerId's perspective, as described in the ps4 handout.
         */
        this.app.get('/acceptFollow/:accepterID/:userID', (request, response) => __awaiter(this, void 0, void 0, function* () {
            const { accepterID, userID } = request.params;
            (0, node_assert_1.default)(postID);
            /**
            const boardState = await look(this.board, playerId);
            response
            .status(StatusCodes.OK) // 200
            .type('text')
            .send(boardState);
            */
        }));
        /*
         * GET /look/<playerId>
         * playerId must be a nonempty string of alphanumeric or underscore characters
         *
         * Response is the board state from playerId's perspective, as described in the ps4 handout.
         */
        this.app.get('/addEvent/:calendarID/:userID', (request, response) => __awaiter(this, void 0, void 0, function* () {
            //needs metadata??
            const { postID, userID } = request.params;
            (0, node_assert_1.default)(postID);
            /**
            const boardState = await look(this.board, playerId);
            response
            .status(StatusCodes.OK) // 200
            .type('text')
            .send(boardState);
            */
        }));
        /*
         * GET /flip/<playerId>/<row>,<column>
         * playerId must be a nonempty string of alphanumeric or underscore characters;
         * row and column must be integers, 0 <= row,column < height,width of board (respectively)
         *
         * Response is the state of the board after the flip from the perspective of playerID,
         * as described in the ps4 handout.
         */
        this.app.get('/flip/:playerId/:location', (request, response) => __awaiter(this, void 0, void 0, function* () {
            const { playerId, location } = request.params;
            (0, node_assert_1.default)(playerId);
            (0, node_assert_1.default)(location);
            const [row, column] = location.split(',').map(s => parseInt(s));
            (0, node_assert_1.default)(row !== undefined && !isNaN(row));
            (0, node_assert_1.default)(column !== undefined && !isNaN(column));
            try {
                const boardState = yield flip(this.board, playerId, row, column);
                response
                    .status(http_status_codes_1.StatusCodes.OK) // 200
                    .type('text')
                    .send(boardState);
            }
            catch (err) {
                response
                    .status(http_status_codes_1.StatusCodes.CONFLICT) // 409
                    .type('text')
                    .send(`cannot flip this card: ${err}`);
            }
        }));
        /*
         * GET /replace/<playerId>/<oldcard>/<newcard>
         * playerId must be a nonempty string of alphanumeric or underscore characters;
         * oldcard and newcard must be nonempty strings.
         *
         * Replaces all occurrences of oldcard with newcard (as card labels) on the board.
         *
         * Response is the state of the board after the replacement from the the perspective of playerID,
         * as described in the ps4 handout.
         */
        this.app.get('/replace/:playerId/:fromCard/:toCard', (request, response) => __awaiter(this, void 0, void 0, function* () {
            const { playerId, fromCard, toCard } = request.params;
            (0, node_assert_1.default)(playerId);
            (0, node_assert_1.default)(fromCard);
            (0, node_assert_1.default)(toCard);
            const boardState = yield map(this.board, playerId, (card) => __awaiter(this, void 0, void 0, function* () { return card === fromCard ? toCard : card; }));
            response
                .status(http_status_codes_1.StatusCodes.OK) // 200
                .type('text')
                .send(boardState);
        }));
        /*
         * GET /watch/<playerId>
         * playerId must be a nonempty string of alphanumeric or underscore characters
         *
         * Waits until the next time the board changes (defined as any cards turning face up or face down,
         * being removed from the board, or changing from one string to a different string).
         *
         * Response is the new state of the board from the perspective of playerID,
         * as described in the ps4 handout.
         */
        this.app.get('/watch/:playerId', (request, response) => __awaiter(this, void 0, void 0, function* () {
            const { playerId } = request.params;
            (0, node_assert_1.default)(playerId);
            const boardState = yield watch(this.board, playerId);
            response
                .status(http_status_codes_1.StatusCodes.OK) // 200
                .type('text')
                .send(boardState);
        }));
        /*
         * GET /
         *
         * Response is the game UI as an HTML page.
         */
        this.app.use(express_1.default.static('public/'));
    }
    /**
     * Start this server.
     *
     * @returns (a promise that) resolves when the server is listening
     */
    start() {
        const { promise, resolve } = Promise.withResolvers();
        this.server = this.app.listen(this.requestedPort);
        this.server.on('listening', () => {
            console.log(`server now listening at http://localhost:${this.port}`);
            resolve();
        });
        return promise;
    }
    /**
     * @returns the actual port that server is listening at. (May be different
     *          than the requestedPort used in the constructor, since if
     *          requestedPort = 0 then an arbitrary available port is chosen.)
     *          Requires that start() has already been called and completed.
     */
    get port() {
        var _a, _b;
        const address = (_b = (_a = this.server) === null || _a === void 0 ? void 0 : _a.address()) !== null && _b !== void 0 ? _b : 'not connected';
        if (typeof (address) === 'string') {
            throw new Error('server is not listening at a port');
        }
        return address.port;
    }
    /**
     * Stop this server. Once stopped, this server cannot be restarted.
     */
    stop() {
        var _a;
        (_a = this.server) === null || _a === void 0 ? void 0 : _a.close();
        driver.close();
        console.log('server stopped');
    }
}
await main();
