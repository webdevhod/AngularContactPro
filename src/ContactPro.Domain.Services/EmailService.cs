using ContactPro.Domain.Entities;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ContactPro.Domain.Services;

public class EmailService
{
    private readonly MailSettings _mailSettings;
    private readonly UtilityService _utilityService;

    public EmailService(IOptions<MailSettings> mailSettings, UtilityService utilityService)
    {
        _mailSettings = mailSettings.Value;
        _utilityService = utilityService;
    }

    public async Task SendEmailAsync(string contactEmail, string subject, string htmlMessage)
    {
        var mimeMessage = new MimeMessage();
        mimeMessage.Sender = MailboxAddress.Parse(_mailSettings.Email ?? Environment.GetEnvironmentVariable("Email"));
        mimeMessage.To.Add(MailboxAddress.Parse(contactEmail));
        mimeMessage.Subject = subject;

        var body = new BodyBuilder();
        body.HtmlBody = htmlMessage;
        mimeMessage.Body = body.ToMessageBody();

        await SendEmailAsync(mimeMessage);
    }

    public async Task SendEmailAsync(ICollection<Contact> contacts, string subject, string htmlMessage)
    {
        var mimeMessage = new MimeMessage();

        mimeMessage.Sender = MailboxAddress.Parse(_utilityService.GetCurrentUserEmail());

        foreach(Contact contact in contacts) {
            mimeMessage.To.Add(MailboxAddress.Parse(contact.Email));
        }

        mimeMessage.Subject = subject;

        var body = new BodyBuilder();
        body.HtmlBody = htmlMessage;
        mimeMessage.Body = body.ToMessageBody();

        await SendEmailAsync(mimeMessage);
    }

    private async Task SendEmailAsync(MimeMessage mimeMessage)
    {
        using var smtp = new SmtpClient();

        try 
        {
            string email = _mailSettings.Email ?? Environment.GetEnvironmentVariable("Email"); 
            string host = _mailSettings.EmailHost ?? Environment.GetEnvironmentVariable("EmailHost");
            string password = _mailSettings.EmailPassword ?? Environment.GetEnvironmentVariable("EmailPassword");
            int port = _mailSettings.EmailPort != 0 ? _mailSettings.EmailPort : Int32.Parse(Environment.GetEnvironmentVariable("EmailPort"));

            smtp.Connect(host, port, SecureSocketOptions.StartTls);
            smtp.Authenticate(email, password);
            await smtp.SendAsync(mimeMessage);
            smtp.Disconnect(true);
        }
        catch
        {
            throw;
        }
    }
}
