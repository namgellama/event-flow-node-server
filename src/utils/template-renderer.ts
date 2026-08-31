import Handlebars from "handlebars";

export function renderTemplate(
    template: string,
    context: Record<string, unknown>,
) {
    const compiledTemplate = Handlebars.compile(template);

    return compiledTemplate(context);
}
