import { Dispatch } from "react";

class MethodStore extends Map<string, Dispatch<React.SetStateAction<any>>> {
    constructor() {
        super();
    }
}

export default MethodStore;