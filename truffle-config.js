const HDWalletProvider = require('@truffle/hdwallet-provider');

const privateKeys = [
  "9802c6c2b68926ae518c8f7da60ae64fa4b2b46cc006964b8df83115947993dd", 
  "0x4246236d5da51097f77e58baae4a86179e242f66426f37aef56ba61438a877e0", 
  "0x8396aa06dc771e5516d423dd03dc3963197c7311ca8c8320e30fb03fe8f9d4d4",
  "0x4a810c04740589b3ca659b8e6da1981e050973b4ec57772a17ce97da32a023cb",
  "0xa0c6068cb41fab32948f04d9ba0b35462f60f5dc4931fdbcf93c5230d5cb3a70"
]

module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
   development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*"
   },
   test: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*"
   },
   rinkeby: {
     provider: () => new HDWalletProvider(privateKeys, `https://rinkeby.infura.io/v3/c45537069ebf4dd7a77b69241b3aafad`, 0, 5),
     network_id: 4,       // Ropsten's id
     gas: 5500000,        // Ropsten has a lower block limit than mainnet
     from: "0x5179935322Ca6F098cba068d9bd4c83Bcbc58798", // default address to use for any transaction Truffle makes during migrations
     confirmations: 0,    // # of confs to wait between deployments. (default: 0)
     timeoutBlocks: 5000,  // # of blocks before a deployment times out  (minimum/default: 50)
     skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
   },
  },
  compilers: {
    solc: {
      version: "^0.8.7"
    }
  }
  //
  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows: 
  // $ truffle migrate --reset --compile-all
  //
  // db: {
    // enabled: false,
    // host: "127.0.0.1",
    // adapter: {
    //   name: "sqlite",
    //   settings: {
    //     directory: ".db"
    //   }
    // }
  // }
};
