export interface BreadCumb {
    title?: string;
    description?: string;
    path?: Path[];
}

interface Path {
    name: string;
    pathString?: string;
}
