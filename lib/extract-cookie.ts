interface CookieConfig {
  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export interface ExtractedCookie {
  name: string;
  value: string;
  config: CookieConfig;
}

const defaultCookieConfig: CookieConfig = {
  path: "/",
  secure: false,
  httpOnly: false,
  sameSite: "lax",
};

export const extractCookie = (
  setCookieHeaders: string[]
): ExtractedCookie[] => {
  return setCookieHeaders.map((cookie) => {
    const [nameValue, ...attributes] = cookie.split(";");
    const [name, value] = nameValue.split("=");

    const config: CookieConfig = { ...defaultCookieConfig };

    // Parse cookie attributes
    attributes.forEach((attr) => {
      const [attrName, attrValue] = attr.split("=");
      const trimmedName = attrName.trim().toLowerCase();

      switch (trimmedName) {
        case "domain":
          config.domain = attrValue;
          break;
        case "path":
          config.path = attrValue;
          break;
        case "expires":
          const expiresDate = new Date(attrValue);
          if (!isNaN(expiresDate.getTime())) {
            config.expires = expiresDate;
          }
          break;
        case "max-age":
          const parsedMaxAge = parseInt(attrValue);
          if (!isNaN(parsedMaxAge)) {
            config.maxAge = parsedMaxAge;

            if (!config.expires) {
              config.expires = new Date(Date.now() + parsedMaxAge * 1000);
            }
          }
          break;
        case "secure":
          config.secure = true;
          break;
        case "httponly":
          config.httpOnly = true;
          break;
        case "samesite":
          const sameSiteValue = attrValue?.toLowerCase();
          if (
            sameSiteValue === "strict" ||
            sameSiteValue === "lax" ||
            sameSiteValue === "none"
          ) {
            config.sameSite = sameSiteValue;
          }
          break;
      }
    });

    return {
      name: name.trim(),
      value: value || "",
      config,
    };
  });
};
