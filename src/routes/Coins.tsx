import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { isDarkAtom } from "../atoms";
import { fetchCoins } from "./api";
import { useRecoilValue, useSetRecoilState } from "recoil";

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

const CoinList = styled.ul``;

const Coin = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border: 1px solid white;
  border-radius: 15px;
  margin-bottom: 15px;
  box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
  transition: background-color 0.2s linear;
  a {
    display: flex;
    align-items: center;
    padding: 15px;
    transition: color 0.2s linear;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
  transition: color 0.2s linear;
`;

const Loader = styled.div`
  text-align: center;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
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

  transition: background-color 0.2s linear;
`;

interface Icoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom); //setter function(value를 설정하는 function)을 리턴
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  //useQuery는 fetcher 함수를 부르고 피니쉬 여부를 boolean값으로 리턴, json data도 리턴
  const { isLoading, data } = useQuery<Icoin[]>("allCoins", fetchCoins); //첫번째는 queryKey, 두번째는 fetcher 함수, 세번째는 refetch 간격

  /*const [coins, setCoins] = useState<Icoin[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();
      setCoins(json.slice(0, 100));
      setLoading(false);
    })();
  }, []);*/

  return (
    <Container>
      <Helmet>
        {/*여기에 작성하면 문서의 head로 감 */}
        <title>암호화폐</title>
      </Helmet>
      <Header>
        <Title>암호화폐</Title>
        <ThemeBtn onClick={toggleDarkAtom}>
          {isDark ? (
            <img src={process.env.PUBLIC_URL + "/images/sun.svg"} alt="Light mode" />
          ) : (
            <img src={process.env.PUBLIC_URL + "/images/moon.svg"} alt="Dark mode" />
          )}
        </ThemeBtn>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/${coin.id}/price`,
                  state: { name: coin.name },
                }}
              >
                <Img src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`} />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinList>
      )}
    </Container>
  );
}

export default Coins;
