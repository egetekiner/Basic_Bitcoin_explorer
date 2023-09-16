from fastapi import FastAPI
from fastapi import HTTPException
import httpx
from pydantic import BaseModel
import asyncio
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stats_data = None
pool_data = None
trade_volume_data = None
price_data = None
pricing_history_1_month = None
pricing_history_3_months =None
pricing_history_6_months =None
pricing_history_1_year = None
pricing_history_2_year = None
pricing_history_3_year = None
pricing_history_all = None

async def fetch_stats_data():
    global stats_data
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("https://api.blockchain.info/stats")
            stats_data = response.json()
            print("Fetched stats data")
        except Exception as e:
            print(f"An error occurred while fetching stats data: {e}")

async def fetch_price_data():
    global price_data
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("https://blockchain.info/ticker")
            price_data = response.json()
            print("Fetched pricing data")
        except Exception as e:
            print(f"An error occurred while fetching stats data: {e}")


async def fetch_pool_data():
    global pool_data
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("https://api.blockchain.info/pools?timespan=10days")
            pool_data = response.json()
            print("Fetched pool data")
        except Exception as e:
            print(f"An error occurred while fetching pool data: {e}")


async def fetch_trade_volume_data():
    global trade_volume_data
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("https://api.blockchain.info/charts/trade-volume?timespan=1year&format=json")
            trade_volume_data = response.json()
            print("Fetched trade volume data")
        except Exception as e:
            print(f"An error occurred while fetching trade volume data: {e}")

async def fetch_pricing_history_1_month():
    global pricing_history_1_month
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("https://api.blockchain.info/charts/trade-volume?timespan=1months&rollingAverage=8hours&format=json")
            pricing_history_1_month = response.json()
            print("Fetched trade volume data")
        except Exception as e:
            print(f"An error occurred while fetching trade volume data: {e}")

async def fetch_pricing_history_3_months():
    global pricing_history_3_months
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("https://api.blockchain.info/charts/trade-volume?timespan=3months&rollingAverage=8hours&format=json")
            pricing_history_1_month = response.json()
            print("Fetched trade volume data")
        except Exception as e:
            print(f"An error occurred while fetching trade volume data: {e}")

async def fetch_pricing_history_6_months():
    global pricing_history_6_months
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("https://api.blockchain.info/charts/trade-volume?timespan=6months&rollingAverage=8hours&format=json")
            pricing_history_1_month = response.json()
            print("Fetched trade volume data")
        except Exception as e:
            print(f"An error occurred while fetching trade volume data: {e}")

async def fetch_pricing_history_1_year():
    global pricing_history_1_year
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("https://api.blockchain.info/charts/trade-volume?timespan=1years&rollingAverage=8hours&format=json")
            pricing_history_1_month = response.json()
            print("Fetched trade volume data")
        except Exception as e:
            print(f"An error occurred while fetching trade volume data: {e}")

async def fetch_pricing_history_2_years():
    global pricing_history_2_years
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("https://api.blockchain.info/charts/trade-volume?timespan=2years&rollingAverage=8hours&format=json")
            pricing_history_1_month = response.json()
            print("Fetched trade volume data")
        except Exception as e:
            print(f"An error occurred while fetching trade volume data: {e}")

async def fetch_pricing_history_3_years():
    global pricing_history_3_years
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("https://api.blockchain.info/charts/trade-volume?timespan=3years&rollingAverage=8hours&format=json")
            pricing_history_1_month = response.json()
            print("Fetched trade volume data")
        except Exception as e:
            print(f"An error occurred while fetching trade volume data: {e}")

async def fetch_pricing_history_all():
    global pricing_history_all
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("https://api.blockchain.info/charts/trade-volume?timespan=all&rollingAverage=8hours&format=json")
            pricing_history_all = response.json()
            print("Fetched trade volume data")
        except Exception as e:
            print(f"An error occurred while fetching trade volume data: {e}")


@app.on_event("startup")
async def startup_event():
    await fetch_stats_data()
    await fetch_pool_data()
    await fetch_trade_volume_data()
    await fetch_price_data()
    await fetch_pricing_history_1_month()
    await fetch_pricing_history_3_months()
    await fetch_pricing_history_6_months()
    await fetch_pricing_history_1_year()
    await fetch_pricing_history_2_years()
    await fetch_pricing_history_3_years()
    await fetch_pricing_history_all()

    asyncio.create_task(update_data())

async def update_data():
    while True:
        await asyncio.gather(
            fetch_pricing_history_1_month(),
            fetch_pricing_history_3_months(),
            fetch_pricing_history_6_months(),
            fetch_pricing_history_1_year(),
            fetch_pricing_history_2_years(),
            fetch_pricing_history_3_years(),
            fetch_pricing_history_all()
        )
        await asyncio.sleep(8 * 60 * 60)  # update every hour



async def update_data():
    while True:
        await asyncio.gather(
            fetch_stats_data(),
            fetch_pool_data(),
            fetch_trade_volume_data()
        )
        await asyncio.sleep(60 * 60)  # update every hour

async def update_price():
    while True:
        await asyncio.gather(
            fetch_price_data()
        )
        await asyncio.sleep(15 * 60)  # update every 15 minutes




@app.get("/stats")
async def get_stats():
    if stats_data:
        return stats_data
    else:
        raise HTTPException(status_code=404, detail="Stats data not yet available")


@app.get("/pool")
async def get_pool():
    if pool_data:
        return pool_data
    else:
        raise HTTPException(status_code=404, detail="Pool data not yet available")


@app.get("/trade_volume")
async def get_trade_volume():
    if trade_volume_data:
        return trade_volume_data
    else:
        raise HTTPException(status_code=404, detail="Trade volume data not yet available")
    
@app.get("/pricing_data")
async def get_pricing():
    if price_data:
        return price_data
    else:
        raise HTTPException(status_code=404, detail="Trade volume data not yet available")


# hostorical pricing data

@app.get("/pricing_history_1month")
async def get_pricing_history_1month():
    if pricing_history_1_month:
        return pricing_history_1_month
    else:
        raise HTTPException(status_code=404, detail="Trade volume data not yet available")

@app.get("/pricing_history_3months")
async def get_pricing_history_3months():
    if pricing_history_3_months:
        return pricing_history_3_months
    else:
        raise HTTPException(status_code=404, detail="Trade volume data not yet available")
    
@app.get("/pricing_history_6months")
async def get_pricing_history_6months():
    if pricing_history_6_months:
        return pricing_history_6_months
    else:
        raise HTTPException(status_code=404, detail="Trade volume data not yet available")

@app.get("/pricing_history_1year")
async def get_pricing_history_1year():
    if pricing_history_1_year:
        return pricing_history_1_year
    else:
        raise HTTPException(status_code=404, detail="Trade volume data not yet available")

@app.get("/pricing_history_2years")
async def get_pricing_history_2years():
    if pricing_history_2_years:
        return pricing_history_2_years
    else:
        raise HTTPException(status_code=404, detail="Trade volume data not yet available")

@app.get("/pricing_history_3years")
async def get_pricing_history_3years():
    if pricing_history_3_years:
        return pricing_history_3_years
    else:
        raise HTTPException(status_code=404, detail="Trade volume data not yet available")


@app.get("/pricing_history_all")
async def get_pricing_history_all():
    if pricing_history_all:
        return pricing_history_all
    else:
        raise HTTPException(status_code=404, detail="Trade volume data not yet available")


@app.get("/rawaddr/{bitcoin_address}")
async def get_raw_address(bitcoin_address: str):
    url = f"https://blockchain.info/rawaddr/{bitcoin_address}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch address data")

@app.get("/block-height/{block_height}")
async def get_block_height(block_height: int):
    url = f"https://blockchain.info/block-height/{block_height}?format=json"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch block height data")

@app.get("/rawtx/{tx_hash}")
async def get_raw_transaction(tx_hash: str):
    url = f"https://blockchain.info/rawtx/{tx_hash}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch transaction data")

    