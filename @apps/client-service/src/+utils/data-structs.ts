export abstract class UniqueList {
    static Ret(list: Array<any>){
        const set = new Set(list);
        return [...set];
    }
}