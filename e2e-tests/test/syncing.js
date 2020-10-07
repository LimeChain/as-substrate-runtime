var assert = require('assert');
const config = require('../config.json');
const NodeClient = require('../node-client');

describe('Syncing', function () {

    before(async () => {
        // get nodeClient for node 1 => instanciate/create connection to the node
        // get nodeClient fore node 2
        const node1 = new NodeClient(9933, true);
        const node2 = new NodeClient(9934, true);
        const node3 = new NodeClient(9945, false);
    })

    it('Nodes should be connected', function () {
        // nodeClient1.getConnection
        // assert that its connected to nodeClient2
    });

    it('Nodes should sync blocks', () => {

    })
});