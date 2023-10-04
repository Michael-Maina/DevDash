import {
  setAdd,
  setIsMember,
  setRemove
} from '../server/utils/redis';

export default class PortHandler {
  static async assignPort() {
    const reservedPorts = [3000, 5000, 3306, 6379, 27017];

    while(true) {
      let desiredPort = Math.floor((Math.random() * (49151 - 1024 + 1)) + 1024);
      const portCheck = await setIsMember('ports:assigned', desiredPort);

      if (portCheck && !(reservedPorts.includes(desiredPort))) {
        return desiredPort;
      }
    } 
  }

  static async setPort(portSet, port) {
    try {
      await setAdd(portSet, port);
      return;
    } catch(error) {
      console.error(`Redis SADD Error: ${error.message}`);
      throw error;
    }
  }

  static async checkPort(portSet, port) {
    try {
      // Returns boolean
      const result = await setIsMember(portSet, port);
      return result;
    } catch(error) {
      console.error(`Redis SISMEMBER Error: ${error.message}`);
      throw error;
    }
  }

  static async delPort(portSet, port) {
    try {
      await setRemove(portSet, port);
    } catch(error) {
      console.error(`Redis SREM Error: ${error.message}`);
      throw error;
    }
  }
}
