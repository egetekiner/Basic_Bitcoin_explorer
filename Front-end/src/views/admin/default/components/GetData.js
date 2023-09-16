import axios from "axios";

let instance = null;

class BlockchainDataInstance {
  constructor() {
    this.pricingData = null;
    this.statsData = null;
    this.poolData = null;
    this.TradeVolume = null;

    this.subscribers = [];

    // Initialize data fetching and set up interval updates
    this.setupIntervals();
  }

  setupIntervals() {
    this.fetchPricingData();
    this.fetchStatsData();
    this.fetchPoolData();
    this.fetchTradeVolumeData1Year();

    setInterval(() => this.fetchPricingData(), 60 * 60 * 1000); // Update every 1 hour
    setInterval(() => this.fetchStatsData(), 24 * 60 * 60 * 1000); // Update every 24 hours
    setInterval(() => this.fetchPoolData(), 24 * 60 * 60 * 1000); // Update every 24 hours
    setInterval(() => this.fetchTradeVolumeData1Year(), 24 * 60 * 60 * 1000); // Update every 24 hours
  }


  subscribe(callback) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter((sub) => sub !== callback);
  }

  notify() {
    this.subscribers.forEach((callback) => callback());
  }

  // Fetch Pricing Data
  async fetchPricingData() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/pricing_data');
      this.pricingData = response.data;
      // console.log('data successfully parsed: Pricing', response.data)
      this.notify();
    } catch (error) {
      console.error("Failed to fetch pricing data:", error);
    }
   
  }


  // Fetch Stats Data
  async fetchStatsData() {
    try {
      const response = await axios.get('http://localhost:8000/stats');
      this.statsData = response.data;
      // console.log('data successfully parsed: Stats', response.data)
      this.notify();
    } catch (error) {
      console.error("Failed to fetch stats data:", error);
    }
    
  }

  // Fetch Pool Data
  async fetchPoolData() {
    try {
      const response = await axios.get('http://localhost:8000/pool');
      this.poolData = response.data;
      // console.log('data successfully parsed: Pools', response.data)
      this.notify();
    } catch (error) {
      console.error("Failed to fetch pool data:", error);
    }
    
  }

  async fetchTradeVolumeData1Year() {
    try {
      const response = await axios.get('http://localhost:8000/trade_volume');
      this.TradeVolume = response.data;
      //console.log('data successfully parsed: Volume', response.data)
      this.notify();
    } catch (error) {
      console.error("Failed to fetch Trade Volume data:", error);
      console.error("Error Details:", error.response.data, error.response.status, error.response.headers);

    }
    
  }

  // Getter methods to allow other parts of the code to access the data
  getPricingData() {
    return this.pricingData;
  }

  getStatsData() {
    return this.statsData;
  }

  getPoolData() {
    return this.poolData;
  }

  getTradeVolumeData1Year() {
    return this.TradeVolume;
  }

}

export default new BlockchainDataInstance();

