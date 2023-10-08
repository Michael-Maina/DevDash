import redisClient from './redis.js';


export default class PortHandler {
  static async assignPort() {
    const reservedPorts = [3000, 5000, 3306, 6379, 8080, 27017];

    while(true) {
      var desiredPort = Math.floor((Math.random() * (49151 - 1024 + 1)) + 1024);
      try {
        const portsAssigned = process.env.REDIS_PORTS_ASSIGNED;
        const portCheck = await redisClient.setIsMember(portsAssigned, desiredPort);

        if (portCheck && !(reservedPorts.includes(desiredPort))) {
          break;
        }
      } catch(error) {
        console.error(error.message);
        break;
      }
    }
    return desiredPort;
  }

  static async setPort(portSet, port) {
    try {
      await redisClient.setAdd(portSet, port);
      return;
    } catch(error) {
      console.error(`Redis SADD Error: ${error}`);
      throw error;
    }
  }

  static async checkPort(portSet, port) {
    try {
      // Returns boolean
      const result = await redisClient.setIsMember(portSet, port);
      return result;
    } catch(error) {
      console.error(`Redis SISMEMBER Error: ${error}`);
      throw error;
    }
  }

  static async delPort(portSet, port) {
    try {
      await redisClient.setRemove(portSet, port);
    } catch(error) {
      console.error(`Redis SREM Error: ${error}`);
      throw error;
    }
  }
}
