using Microsoft.AspNetCore.Http;

namespace ContactPro.Infrastructure.Web.Rest.Utilities;

public static class HeaderUtil
{
    private static readonly string APPLICATION_NAME = "contactProApp";

    public static IHeaderDictionary CreateAlert(string message, string param)
    {
        IHeaderDictionary headers = new HeaderDictionary();
        headers.Add($"X-{APPLICATION_NAME}-alert", message);
        headers.Add($"X-{APPLICATION_NAME}-params", param);
        return headers;
    }

    public static IHeaderDictionary CreateEntityCreationAlert(string name, string entityName, string param)
    {
        return CreateAlert($"{name} {entityName} created!", param);
    }

    public static IHeaderDictionary CreateEntityUpdateAlert(string name, string entityName, string param)
    {
        return CreateAlert($"{name} {entityName} updated!", param);
    }

    public static IHeaderDictionary CreateEntityEmailAlert(string name, string entityName, string param)
    {
        // loop through contact list
        return CreateAlert($"{name} emailed!", param);
    }

    public static IHeaderDictionary CreateEntityDeletionAlert(string name, string entityName, string param)
    {
        return CreateAlert($"{name} {entityName} deleted!", param);
    }

    public static IHeaderDictionary CreateFailureAlert(string entityName, string errorKey, string defaultMessage)
    {
        //log.error("Entity processing failed, {}", defaultMessage);
        IHeaderDictionary headers = new HeaderDictionary();
        headers.Add($"X-{APPLICATION_NAME}-error", $"error.{errorKey}");
        headers.Add($"X-{APPLICATION_NAME}-params", entityName);
        return headers;
    }
}
