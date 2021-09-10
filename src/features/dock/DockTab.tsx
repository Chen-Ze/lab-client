import { AlertTab } from "../alert/AlertTab";
import { DataGridTab } from "../data/DataGridTab";
import { MonitorTab } from "../monitor/MonitorTab";
import { PlotTab } from "../plot/PlotTab";
import { SequenceTab } from "../sequence/SequenceTab";
import { DockTabProps, TabName } from "./dock-properties";


interface Props {
    type: TabName,
    tabProps: DockTabProps
}

export const DockTab: React.FC<Props> = (props) => {
    switch (props.type) {
        case TabName.Monitor:
            return <MonitorTab {...props.tabProps} />;
        case TabName.Data:
            return <DataGridTab {...props.tabProps} />;
        case TabName.Sequence:
            return <SequenceTab {...props.tabProps} />;
        case TabName.Plot:
            return <PlotTab {...props.tabProps} />;
        case TabName.Alert:
            return <AlertTab {...props.tabProps} />;
    }
}