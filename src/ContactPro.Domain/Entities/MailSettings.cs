using System;
namespace ContactPro.Domain.Entities
{
    public class MailSettings
    {
        public string Email { get; set; }
        public string EmailPassword { get; set; }
        public string EmailDisplayName { get; set; }
        public string EmailHost { get; set; }
        public int EmailPort { get; set; }
    }
}

