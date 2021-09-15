import { EntityId } from "@reduxjs/toolkit";
import axios from "axios";


export interface TimeStampedValue<T> {
    time: number,
    value: T
};

export enum MonitorPrototype {
    Keithley2600SMUA = "Keithley 2600 SMU A",
    Keithley2600SMUB = "Keithley 2600 SMU B",
    Keithley2400SMU = "Keithley 2400"
}

export interface MonitorResponse {
    type: MonitorPrototype,
    monitorId: EntityId,
}

interface Keithley2600SMUAMonitorResponse extends MonitorResponse {
    type: MonitorPrototype.Keithley2600SMUA,
    smuAVoltage: TimeStampedValue<number>,
    smuACurrent: TimeStampedValue<number>
}

export function isKeithley2600SMUAMonitorResponse(response: MonitorResponse): response is Keithley2600SMUAMonitorResponse {
    return response.type === MonitorPrototype.Keithley2600SMUA;
}

interface Keithley2600SMUBMonitorResponse extends MonitorResponse {
    type: MonitorPrototype.Keithley2600SMUB,
    smuBVoltage: TimeStampedValue<number>,
    smuBCurrent: TimeStampedValue<number>
}

export function isKeithley2600SMUBMonitorResponse(response: MonitorResponse): response is Keithley2600SMUBMonitorResponse {
    return response.type === MonitorPrototype.Keithley2600SMUB;
}

interface Keithley2400SMUMonitorResponse extends MonitorResponse {
    type: MonitorPrototype.Keithley2400SMU
    smuVoltage: TimeStampedValue<number>,
    smuCurrent: TimeStampedValue<number>
}

export function isKeithley2400SMUMonitorResponse(response: MonitorResponse): response is Keithley2400SMUMonitorResponse {
    return response.type === MonitorPrototype.Keithley2400SMU;
}

export async function fetchKeithley2600SMUA(monitorId: EntityId, address: string): Promise<Keithley2600SMUAMonitorResponse> {
    // connection
    await axios.get('/server/open-model', {
        params: {
            name: String(monitorId),
            address,
            model: "Model2600"
        }
    });

    const smuAVoltageResponse = (
        await axios.get('/server/query-model', {
            params: {
                name: String(monitorId),
                task: "measure-smua-voltage",
                model: "Model2600"
            }
        })
    ).data;
    const smuAVoltageTime = Date.now();
    const smuACurrentResponse = (
        await axios.get('/server/query-model', {
            params: {
                name: String(monitorId),
                task: "measure-smua-current",
                model: "Model2600"
            }
        })
    ).data;
    const smuACurrentTime = Date.now();
    return {
        type: MonitorPrototype.Keithley2600SMUA,
        monitorId,
        smuAVoltage: {
            time: smuAVoltageTime,
            value: Number(smuAVoltageResponse.read)
        },
        smuACurrent: {
            time: smuACurrentTime,
            value: Number(smuACurrentResponse.read)
        }
    };
}

export function defaultKeithley2600SMUAResponse(monitorId: EntityId): Keithley2600SMUAMonitorResponse {
    return {
        type: MonitorPrototype.Keithley2600SMUA,
        monitorId,
        smuAVoltage: {
            time: NaN,
            value: NaN
        },
        smuACurrent: {
            time: NaN,
            value: NaN
        }
    };
}

export async function fetchKeithley2600SMUB(monitorId: EntityId, address: string): Promise<Keithley2600SMUBMonitorResponse> {
    // connection
    await axios.get('/server/open-model', {
        params: {
            name: String(monitorId),
            address,
            model: "Model2600"
        }
    });

    const smuBVoltageResponse = (
        await axios.get('/server/query-model', {
            params: {
                name: String(monitorId),
                task: "measure-smub-voltage",
                model: "Model2600"
            }
        })
    ).data;
    const smuBVoltageTime = Date.now();
    const smuBCurrentResponse = (
        await axios.get('/server/query-model', {
            params: {
                name: String(monitorId),
                task: "measure-smub-current",
                model: "Model2600"
            }
        })
    ).data;
    const smuBCurrentTime = Date.now();
    return {
        type: MonitorPrototype.Keithley2600SMUB,
        monitorId,
        smuBVoltage: {
            time: smuBVoltageTime,
            value: Number(smuBVoltageResponse.read)
        },
        smuBCurrent: {
            time: smuBCurrentTime,
            value: Number(smuBCurrentResponse.read)
        }
    };
}

export function defaultKeithley2600SMUBResponse(monitorId: EntityId): Keithley2600SMUBMonitorResponse {
    return {
        type: MonitorPrototype.Keithley2600SMUB,
        monitorId,
        smuBVoltage: {
            time: NaN,
            value: NaN
        },
        smuBCurrent: {
            time: NaN,
            value: NaN
        }
    };
}

export async function fetchKeithley2400SMU(monitorId: EntityId, address: string): Promise<Keithley2400SMUMonitorResponse> {
    // connection
    await axios.get('/server/open-model', {
        params: {
            name: String(monitorId),
            address,
            model: "Model2400"
        }
    });

    const smuVoltageResponse = (
        await axios.get('/server/query-model', {
            params: {
                name: String(monitorId),
                task: "measure-smu-voltage",
                model: "Model2400"
            }
        })
    ).data;
    const smuVoltageTime = Date.now();
    const smuCurrentResponse = (
        await axios.get('/server/query-model', {
            params: {
                name: String(monitorId),
                task: "measure-smu-current",
                model: "Model2400"
            }
        })
    ).data;
    const smuCurrentTime = Date.now();
    return {
        type: MonitorPrototype.Keithley2400SMU,
        monitorId,
        smuVoltage: {
            time: smuVoltageTime,
            value: Number(smuVoltageResponse.read)
        },
        smuCurrent: {
            time: smuCurrentTime,
            value: Number(smuCurrentResponse.read)
        }
    };
}

export function defaultKeithley2400SMUResponse(monitorId: EntityId): Keithley2400SMUMonitorResponse {
    return {
        type: MonitorPrototype.Keithley2400SMU,
        monitorId,
        smuVoltage: {
            time: NaN,
            value: NaN
        },
        smuCurrent: {
            time: NaN,
            value: NaN
        }
    };
}
