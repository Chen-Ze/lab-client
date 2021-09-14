import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { TimeStampedValueSelector } from "../monitorSlice";
import { ParameterTable } from "./ParameterTable";


export interface Entry<T> {
    selector: TimeStampedValueSelector<T>,
    title: string,
    render: (data: T) => unknown
}

export function makeRealtimeTableEntry<T>(entry: Entry<T>): Entry<T> {
    return entry;
}

interface Props {
    entries: Entry<any>[]
}

export const RealtimeTable: React.FC<Props> = (props) => {
    const parameters = Array<{key: string, value: any}>(props.entries.length);
    const allValues = useSelector((state: RootState) => props.entries.map(({selector}) => selector(state)));
    for (let i = 0; i < parameters.length; i++) {
        parameters[i] = {
            key: props.entries[i].title,
            value: props.entries[i].render(allValues[i].value)
        };
    }
    return <ParameterTable {...{parameters}} />
}
