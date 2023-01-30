using ContactPro.Configuration;
using ContactPro.Domain.Entities;
using ContactPro.Domain.Services;
using ContactPro.Infrastructure.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ContactPro.Configuration;

public static class AppSettingsConfiguration
{
    public static IServiceCollection AddAppSettingsModule(this IServiceCollection services, IConfiguration configuration)
    {
        // Use this to load settings from appSettings file
        services.Configure<SecuritySettings>(options => configuration.GetSection("security").Bind(options));
        services.AddScoped<UtilityService>();
        services.AddScoped<EmailService>();
        services.Configure<MailSettings>(configuration.GetSection("MailSettings"));

        return services;
    }
}
