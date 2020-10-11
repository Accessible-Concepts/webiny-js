import models from "./models";
import graphql from "./graphql";
import i18n from "./i18n";

export default () => [
    models(),
    graphql,
    i18n,
    {
        name: "context-i18n-get-locales",
        type: "context-i18n-get-locales",
        async resolve({ context }) {
            return [];
            const { I18NLocale } = context.models;
            const locales = await I18NLocale.find();
            return locales.map(locale => ({
                id: locale.id,
                code: locale.code,
                default: locale.default,
                createdOn: locale.createdOn
            }));
        }
    }
];
