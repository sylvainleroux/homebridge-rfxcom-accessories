import {
  PlatformAccessory,
  API,
} from 'homebridge';
import { Device } from '../device';

import { RFXCOMAccessories } from '../platform';

export class MotionSensorDevice extends Device {
  constructor(
    public readonly api: API,
    public readonly id: string,
    public readonly name: string,
    public readonly type: string,
    public readonly subtype: string,
    public readonly forceOffAtStartup: boolean,
  ) {
    super(api, 'MotionSensorDevice', id, name);
  }
}

export class MotionSensorEvent {
  constructor(public readonly motion: boolean) {}
}

export class MotionSensorAccessory {
  constructor(
    private readonly platform: RFXCOMAccessories,
    private readonly accessory: PlatformAccessory,
    private readonly event: MotionSensorEvent,
  ) {
    this.accessory
      .getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'sleroux')
      .setCharacteristic(this.platform.Characteristic.Model, 'MotionSensor')
      .setCharacteristic(
        this.platform.Characteristic.SerialNumber,
        this.accessory.UUID,
      );

    // motion
    const motion = this.event.motion;

    if (motion !== undefined) {
      const motionService =
        this.accessory.getService(this.platform.Service.MotionSensor) ||
        this.accessory.addService(this.platform.Service.MotionSensor);

      motionService.setCharacteristic(this.platform.Characteristic.MotionDetected, motion);

      motionService.setCharacteristic(
        this.platform.Characteristic.Name,
        this.accessory.displayName,
      );
    }
  }
}
