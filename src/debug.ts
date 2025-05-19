import { 
  fetchAllPies, 
  fetchOpenPositions, 
  fetchPosition,
  fetchAccountCash,
  fetchAccountMetadata 
} from "./api/api.js"
import { mapToolResponse } from "./tools/MCPTool.js"

type DebugOptions = {
  account?: boolean;
  portfolio?: boolean;
  pies?: boolean;
  position?: string;
}

const parseArgs = (): DebugOptions => {
  const args = process.argv.slice(2);
  const options: DebugOptions = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--account':
        options.account = true;
        break;
      case '--portfolio':
        options.portfolio = true;
        break;
      case '--pies':
        options.pies = true;
        break;
      case '--position':
        if (i + 1 < args.length) {
          options.position = args[i + 1];
          i++; // Skip the next argument as it's the position value
        }
        break;
    }
  }

  // If no options provided, run all tests
  if (Object.keys(options).length === 0) {
    return {
      account: true,
      portfolio: true,
      pies: true
    };
  }

  return options;
}

export const runDebug = async () => {
  const options = parseArgs();
  console.log("\n=== Testing Trading212 API Endpoints ===\n")

  if (options.account) {
    console.log("1. Account Information:")
    console.log("----------------------")
    console.log("\n-- Fetch Account Cash:")
    const accountCash = await fetchAccountCash()
    displayResult(accountCash)

    console.log("\n-- Fetch Account Metadata:")
    const accountMetadata = await fetchAccountMetadata()
    displayResult(accountMetadata)
  }

  if (options.portfolio) {
    console.log("\n2. Portfolio Information:")
    console.log("------------------------")
    console.log("\n-- Fetch Open Positions:")
    const positions = await fetchOpenPositions()
    displayResult(positions)
  }

  if (options.position) {
    console.log(`\n-- Fetch Specific Position (${options.position}):`)
    const position = await fetchPosition(options.position)
    displayResult(position)
  }

  if (options.pies) {
    console.log("\n3. Pies Information:")
    console.log("-------------------")
    console.log("\n-- Fetch All Pies:")
    const pies = await fetchAllPies()
    displayResult(pies)
  }
}

const displayResult = (result: any) => {
  if (result !== null) {
    if (Array.isArray(result)) {
      console.log(`Found ${result.length} items:`)
    }
    mapToolResponse(result).forEach(content => {      
      console.log(content.text)    
    })
  } else {
    console.log("Result is NULL")
  }
}

// Add help text
const showHelp = () => {
  console.log(`
Usage: npm run debug [options]

Options:
  --account     Test account information endpoints
  --portfolio   Test portfolio endpoints
  --pies        Test pies endpoints
  --position    Test specific position endpoint (requires ticker)
                Example: --position TTWO_US_EQ

If no options are provided, all tests will run.
  `)
}

// Show help if --help is requested
if (process.argv.includes('--help')) {
  showHelp();
  process.exit(0);
}

