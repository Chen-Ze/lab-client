import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { MonitorLastSelector } from "../monitorSlice";
import { ParameterTable } from "./ParameterTable";


interface Entry {
    selector: MonitorLastSelector,
    title: string,
    render: (data: ReturnType<MonitorLastSelector>) => any
}

interface Props {
    entries: Entry[]
}

export const RealtimeTable: React.FC<Props> = (props) => {
    const parameters = Array<{key: string, value: any}>(props.entries.length);
    const allValues = useSelector((state: RootState) => props.entries.map(({selector}) => selector(state)));
    for (let i = 0; i < parameters.length; i++) {
        parameters[i] = {
            key: props.entries[i].title,
            value: props.entries[i].render(allValues[i])
        };
    }
    return <ParameterTable {...{parameters}} />
}
