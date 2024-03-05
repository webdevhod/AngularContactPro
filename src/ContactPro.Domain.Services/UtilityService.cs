using ContactPro.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Security.Claims;

namespace ContactPro.Domain.Services
{
    public class UtilityService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly ClaimsPrincipal User;
        private readonly User currentUser;

        public UtilityService(UserManager<User> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            User = httpContextAccessor.HttpContext.User;
            currentUser = _userManager.Users.Where(user => user.Login == GetCurrentUserName()).SingleOrDefault();
        }

        public string GetCurrentUserEmail()
        {
            return currentUser.Email;
        }

        public string GetCurrentUserId()
        {
            return currentUser.Id;
        }

        public string GetCurrentUserName()
        {
            return _userManager.GetUserName(User);
        }

        public DateTime GetNowInUtc()
        {
            return DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
        }

        public DateTime GetDateTimeInUtc(DateTime dateTime)
        {
            return DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
        }

        public string GetAbsoluteUri()
        {
            var uriBuilder = new UriBuilder(_httpContextAccessor.HttpContext.Request.Scheme, _httpContextAccessor.HttpContext.Request.Host.Host, _httpContextAccessor.HttpContext.Request.Host.Port ?? -1);
            if (uriBuilder.Uri.IsDefaultPort)
            {
                uriBuilder.Port = -1;
            }
            return uriBuilder.Uri.AbsoluteUri;
        }
    }
}

