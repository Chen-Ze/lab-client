import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SaveIcon from '@material-ui/icons/Save';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import Editor, { loader } from "@monaco-editor/react";
import dateFormat from 'dateformat';
import { saveAs } from 'file-saver';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFilePicker } from 'use-file-picker';
import { DockTabProps, TabPosition } from "../dock/dock-properties";
import { fetchMonitor } from "../monitor/monitorSlice";
import { setImmediateInterval } from "../util/util";
import { sequenceImported } from "./sequenceSlice";
import { selectSequenceState, SequenceDocument } from "./SequenceDocument";


loader.config({
    paths: {
        vs: `/server/vs`
    }
})

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        speedDial: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(4),
        },
    }),
);

interface SpeedDialProps {
    openFileSelector: () => any,
}

const SequenceSpeedDial: React.FC<SpeedDialProps> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const sequenceState = useSelector(selectSequenceState);

    const actions = [
        {
            icon: <SaveIcon />,
            name: 'Save',
            callback: () => {
                const blob = new Blob([JSON.stringify(sequenceState, null, 4)], { type: "text/plain;charset=utf-8" });
                saveAs(blob, `Sequence-${dateFormat(new Date(), 'yyyy-mm-dd-HH-MM-ss')}.json`);
            }
        },
        {
            icon: <ExitToAppIcon />,
            name: 'Import',
            callback: () => {
                props.openFileSelector();
            }
        },
    ];

    return (
        <SpeedDial
            ariaLabel="Sequence speedDial"
            className={classes.speedDial}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipOpen
                    onClick={() => { action.callback(); handleClose(); }}
                />
            ))}
        </SpeedDial>
    );
}

interface Props extends DockTabProps {

}

export const SequenceTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const sequenceState = useSelector(selectSequenceState);

    const [openFileSelector, { filesContent, clear }] = useFilePicker({
        accept: '.json',
        limitFilesConfig: {
            max: 1
        }
    });

    // Wrap the callback in useEffect
    // Otherwise "Cannot update a component while rendering a different component"
    useEffect(() => {
        if (filesContent.length) {
            const json = JSON.parse(filesContent[0].content) as SequenceDocument;
            clear();
            dispatch(sequenceImported(json));
            Object.entries(json.monitor.entities).forEach(([key, value]) => {
                if (!value) return;
                const { id, delay, prototype, address } = value;
                setImmediateInterval(() => dispatch(fetchMonitor({
                    id,
                    monitorPrototype: prototype,
                    address
                })), delay, String(id));
            });
        }
    });

    if (props.position === TabPosition.Bottom)
        return (
            <div style={{
                position: "relative",
                height: "100%"
            }}>
                <Editor
                    height="100%"
                    defaultLanguage="json"
                    value={JSON.stringify(sequenceState, null, 4)}
                    theme={theme.palette.type === 'light' ? 'light' : 'vs-dark'}
                    options={{
                        readOnly: true
                    }}
                />
                <SequenceSpeedDial {...{ openFileSelector }} />
            </div>
        );
    else return (
        <div style={{
            flexGrow: 1,
            height: "100%",
            maxHeight: "100%",
            position: "relative"
        }} >
            <Editor
                height="100%"
                defaultLanguage="json"
                value={JSON.stringify(sequenceState, null, 4)}
                theme={theme.palette.type === 'light' ? 'light' : 'vs-dark'}
                options={{
                    readOnly: true
                }}
            />
            <SequenceSpeedDial {...{ openFileSelector }} />
        </div>
    );
}
