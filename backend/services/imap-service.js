// backend/services/imap-service.js
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const Email = require('../models/email'); // Corrected path to model

const imapService = {
    fetchInboxEmails: async (mailbox) => {
        return new Promise((resolve, reject) => {
            const imapConfig = {
                user: mailbox.imapUsername, // Use mailbox.imapUsername, etc. from the model
                password: mailbox.imapPassword,
                host: mailbox.imapServerName,
                port: mailbox.imapPort,
                tlsOptions: {
                    rejectUnauthorized: false // Temporarily disable certificate verification
                }, // Adjust TLS based on enum
                // For STARTTLS, you might need to configure `starttls: { ... }` if needed by 'imap' library
                authTimeout: 10000
            };

            console.log("IMAP Config:", imapConfig); // Log IMAP config

            const imap = new Imap(imapConfig);

            imap.once('ready', () => {
                console.log('IMAP ready event triggered'); // Log ready event
                imap.openBox('INBOX', false, async (err, box) => {
                    if (err) {
                        console.error('Error opening inbox:', err);
                        imap.end();
                        return reject(err);
                    }
                    console.log('Inbox opened successfully:', box); // Log inbox info

                    const f = imap.seq.fetch('1:*', { // Fetch all messages, adjust range as needed
                        bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
                        struct: true
                    });

                    let emails = [];

                    f.on('message', (msg, seqno) => {
                        console.log('Message #%d start', seqno); // Log message start
                        const prefix = '(#' + seqno + ') ';

                        msg.on('body', (stream, info) => {
                            let buffer = '';
                            stream.on('data', (chunk) => {
                                buffer += chunk.toString('utf8');
                            });
                            stream.once('end', async () => {
                                if (info.which === 'TEXT') {
                                    try {
                                        const parsedEmail = await simpleParser(buffer);
                                        emails.push(parsedEmail);
                                        console.log('Parsed email and added to array:', seqno); // Log after parsing
                                    } catch (parseError) {
                                        console.error('Error parsing email body:', parseError);
                                    }
                                } else { // HEADER
                                    // You can process headers if needed, already parsed by mailparser
                                }
                            });
                        });
                        msg.once('attributes', (attrs) => {
                            // console.log(prefix + 'Attributes: %o', attrs);
                        });
                        msg.once('end', () => {
                            console.log('Message #%d finished', seqno); // Log message finished
                        });
                    });
                    f.once('error', (fetchErr) => {
                        console.error('IMAP fetch sequence error:', fetchErr);
                        imap.end();
                        reject(fetchErr);
                    });
                    f.once('end', () => {
                        console.log('Done fetching all messages! Resolving with emails array'); // Log before resolve
                        imap.end();
                        resolve(emails); // Resolve with the emails array
                    });
                });
            });

            imap.once('error', (connErr) => {
                console.error('IMAP connection error:', connErr);
                reject(connErr);
            });

            imap.once('end', () => {
                console.log('IMAP connection ended');
            });

            imap.connect();
        });
    },
};

module.exports = imapService;