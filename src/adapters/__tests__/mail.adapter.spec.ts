import { MailConfig } from 'src/configs/mail.config';
import { MailAdapter } from '../mail.adapter';

/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock('nodemailer');
const nodemailer = require('nodemailer');

describe('[unit] MailAdapter Tests', function () {
    let mailConfig: MailConfig;
    let mailAdapter: MailAdapter;

    beforeAll(function () {
        mailConfig = new MailConfig({
            smtpServerDomain: 'smtp.aaa.com',
            smtpServerPort: 26,
            serviceAddress: 'service@payever.com',
            adminAddress: 'mamad@payever.com',
        });
        mailAdapter = new MailAdapter(mailConfig);
    });

    // Basic Arrange
    beforeEach(async function () {
        jest.clearAllMocks();
    });

    it(`MailAdapter.notifyAdmin - SMTP Server is Not Responsive - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const sendMail = jest.fn(async function (mail) {
            mail;
            throw new Error();
        });
        nodemailer.createTransport.mockImplementation(function (options) {
            options;
            return {
                sendMail: sendMail,
            };
        });
        let errorOccured = false;

        // Act
        try {
            await mailAdapter.notifyAdmin('Hey!', 'Mamad!');
        } catch (e: unknown) {
            errorOccured = true;
        }

        // Assert
        expect(sendMail.mock.calls).toHaveLength(1);
        expect(sendMail.mock.calls[0][0]).toStrictEqual({
            from: 'service@payever.com',
            to: 'mamad@payever.com',
            subject: 'Hey!',
            text: 'Mamad!',
        });
        expect(errorOccured).toBe(true);
    });

    it(`MailAdapter.notifyAdmin - SMTP Server is Responsive - Notify the Admin`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const sendMail = jest.fn();
        nodemailer.createTransport.mockImplementation(function (options) {
            options;
            return {
                sendMail: sendMail,
            };
        });
        let errorOccured = false;

        // Act
        try {
            await mailAdapter.notifyAdmin('Hey!', 'Mamad!');
        } catch (e: unknown) {
            errorOccured = true;
        }

        // Assert
        expect(sendMail.mock.calls).toHaveLength(1);
        expect(sendMail.mock.calls[0][0]).toStrictEqual({
            from: 'service@payever.com',
            to: 'mamad@payever.com',
            subject: 'Hey!',
            text: 'Mamad!',
        });
        expect(errorOccured).toBe(false);
    });
});
