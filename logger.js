require('dotenv').config()
const moment = require("moment");

const dsteem = require('dsteem');
const client = new dsteem.Client('https://api.steemit.com');
const db = require("./mysql");

async function get_last_op_id(username)
{
    return new Promise(async resolve => {
        let data = await client.database.call("get_account_history", [username, 10000000, 1]);
        return resolve(data[0][0])
    });
}

function remove_unusable_ops(data)
{
    let oldest = moment(data[0][1].timestamp).startOf("day");
    for (let i = 0; i < data.length; i++) {

        let daysago = oldest.diff(data[i][1].timestamp, "day");

        if (daysago !== 0)
        {
            data.slice(data.length - i, i);
            return data;
        }
    }
}

async function parse_opts(username)
{
    return new Promise(async resolve => {
        const chain_properties = await client.database.getDynamicGlobalProperties();

        const total_vesting_shares = chain_properties.total_vesting_shares;
        const total_vesting_fund_steem = chain_properties.total_vesting_fund_steem;

        const id = await get_last_op_id(username);
        let ops = 10000;
        if (id < 10000)
            ops = id;

        let data = await client.database.call("get_account_history", [username, id, ops]);

        data = remove_unusable_ops(data);


        let earnings = {};

        for (let i = 0; i < data.length; i++) {

            let timestamp = moment(data[i][1].timestamp).startOf("day");

            if (earnings[timestamp] === undefined)
            {
                earnings[timestamp] = {
                    benefs_sbd : 0,
                    benefs_sp : 0,
                    benefs_steem : 0,
                    curation_rewards : 0,
                    producer_reward : 0,
                    author_sbd : 0,
                    author_sp : 0,
                    author_steem : 0,
                }

            }

            const op = data[i][1].op;

            if (op[0] === "comment_benefactor_reward")
            {
                earnings[timestamp].benefs_sbd += parseFloat(op[1].sbd_payout)
                earnings[timestamp].benefs_steem += parseFloat(op[1].steem_payout)
                earnings[timestamp].benefs_sp += parseFloat(parseFloat(total_vesting_fund_steem) *
                    (parseFloat(op[1].vesting_payout) / parseFloat(total_vesting_shares)),6);

            }
            else if (op[0] === "producer_reward")
            {
                earnings[timestamp].producer_reward += parseFloat(parseFloat(total_vesting_fund_steem) *
                    (parseFloat(op[1].vesting_shares) / parseFloat(total_vesting_shares)),6);
            }
            else if (op[0] === "curation_reward")
            {
                earnings[timestamp].curation_rewards += parseFloat(parseFloat(total_vesting_fund_steem) *
                    (parseFloat(op[1].reward) / parseFloat(total_vesting_shares)),6);
            } else if (op[0] === "author_reward")
            {
                earnings[timestamp].author_sbd += parseFloat(op[1].sbd_payout)
                earnings[timestamp].author_steem += parseFloat(op[1].steem_payout)
                earnings[timestamp].author_sp += parseFloat(parseFloat(total_vesting_fund_steem) *
                    (parseFloat(op[1].vesting_payout) / parseFloat(total_vesting_shares)),6);
            }
        }

        return resolve(earnings);
    });
}


async function get_rewards()
{
    let earnings = await  parse_opts("steempress");

    for (let key in earnings)
    {
        const day = earnings[key];

        db("INSERT INTO ")

    }

    console.log(earnings);
}


function wait(time)
{
    return new Promise(resolve => {
        setTimeout(() => resolve('☕'), time*1000); // miliseconds to seconds
    });
}

async function execute() {
    while (true) {
        await get_rewards();
        await wait(3600);
    }
}

execute();