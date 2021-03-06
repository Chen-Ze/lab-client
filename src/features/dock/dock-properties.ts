export enum TabPosition {
    Left = 'left',
    Bottom = 'bottom',
    Right = 'right'
}

export interface DockTabProps {
    position: TabPosition
}

export enum TabName {
    Monitor  = "Monitor",
    Data     = "Data",
    Sequence = "Sequence",
    Plot     = "Plots",
    Alert    = "Alerts"
}

export interface DockProps {
    position: TabPosition,
}
