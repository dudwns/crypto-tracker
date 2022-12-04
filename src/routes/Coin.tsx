import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import { Link, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "./api";
import { Helmet } from "react-helmet";

import Chart from "./Chart";
import Price from "./Price";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 15px;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
  transition: color 0.2s linear;
`;

const Loader = styled.div`
  text-align: center;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: ${(props) => props.theme.cardBgColor};
  transition: background-color 0.2s linear;
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid white;
  margin: 20px 0;
  box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
  border: 1px solid white;
  border-radius: 10px;
  padding: 10px 20px;
  line-height: 25px;
  background-color: ${(props) => props.theme.cardBgColor};
  transition: background-color 0.2s linear;
  box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  font-size: 15px;
  font-weight: 400;
  background-color: inherit;
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) => (props.isActive ? props.theme.accentColor : props.theme.textColor)};
  a {
    border-bottom: 1px solid ${(props) => (props.isActive ? props.theme.accentColor : props.theme.textColor)};
    padding-bottom: 10px;
    transition: color 0.2s linear;
  }
`;

const HomeBtn = styled.button`
  width: 40px;
  height: 40px;
  font-size: 40px;
  background-color: inherit;
  border: none;
  color: #3867d6;
  position: absolute;
  left: 30px;
  top: 40px;
`;

const ThemeBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: none;
  box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
  background-color: ${(props) => props.theme.bgColor};
  position: absolute;
  right: 30px;
  top: 50px;

  transition: background-color 0.3s linear;
`;

interface RouteParams {
  coinId: string;
}

interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom); //setter function(value를 설정하는 function)을 리턴
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  const { coinId } = useParams<RouteParams>(); //URL의 변수값의 정보를 저장
  const { state } = useLocation<RouteState>(); //Link의 state값을 받아옴
  const priceMatch = useRouteMatch("/:coinId/price"); //내가 위치한 url이 어디인지 확인, 맞으면 object를 받고 틀리면 null을 리턴
  const chartMatch = useRouteMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(["info", coinId], () => fetchCoinInfo(coinId));
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(["tickers", coinId], () => fetchCoinTickers(coinId), { refetchInterval: 5000 });

  /* const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<InfoData>();
  const [priceInfo, setPriceInfo] = useState<PriceData>();
  useEffect(() => {
    (async () => {
      const infoData = await (await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)).json();
      const priceData = await (await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)).json();
      setInfo(infoData);
      setPriceInfo(priceData);
      setLoading(false);
    })();
  }, [coinId]); */

  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        {/*여기에 작성하면 문서의 head로 감 */}
        <title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</title>
      </Helmet>
      <Header>
        <Title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</Title>
      </Header>
      <Link to={`/`}>
        <HomeBtn>←</HomeBtn>
      </Link>
      <ThemeBtn onClick={toggleDarkAtom}>
        {isDark ? (
          <img src={process.env.PUBLIC_URL + "/images/sun.svg"} alt="Light mode" />
        ) : (
          <img src={process.env.PUBLIC_URL + "/images/moon.svg"} alt="Dark mode" />
        )}
      </ThemeBtn>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>순위</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>티커</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>현재가</span>
              <span>${tickersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Overview>
            <OverviewItem>
              <span>총량</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>최대 발행량</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>

          <Tabs>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
          </Tabs>

          <Switch>
            <Route path={`/:coinId/price`}>
              <Price
                ath_date={tickersData?.quotes.USD.ath_date}
                ath_price={tickersData?.quotes.USD.ath_price}
                percent_change_1h={tickersData?.quotes.USD.percent_change_1h}
                percent_change_6h={tickersData?.quotes.USD.percent_change_6h}
                percent_change_12h={tickersData?.quotes.USD.percent_change_12h}
                percent_change_24h={tickersData?.quotes.USD.percent_change_24h}
                percent_change_7d={tickersData?.quotes.USD.percent_change_7d}
                percent_change_30d={tickersData?.quotes.USD.percent_change_30d}
              />
            </Route>
            <Route path={`/:coinId/chart`}>
              <Chart coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}

export default Coin;
function userQuery() {
  throw new Error("Function not implemented.");
}
