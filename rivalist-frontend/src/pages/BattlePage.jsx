import TypingBattle from '@/components/TypingBattle';
import { useBattle } from '@/utils/StompContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BattlePage = () => {
  const { battleData, updateBattleData} = useBattle();
  const navigate = useNavigate();
  let id = localStorage.getItem("battleId");
  // console.log("Battle data in battle page: ", battleData);  

  // access through url or browser page navigation
  useEffect(()=>{
    if (!battleData?.battleId || battleData.battleId == id) {
      navigate("/", {replace : true});
    } else {
      localStorage.setItem("battleId", battleData.battleId);
    }
  }, [])

  // don't render if the battle already happened
  if (!battleData?.battleId || battleData.battleId == id) {
    return null;
  }

  switch (battleData.category) {
    case 'TB':
      return <TypingBattle/>;
    case 'CSS':
      return <CssBattle data={battleData} />;
    case 'CF':
      return <CodeforcesBattle data={battleData} />;
    default:
      return <div>Unknown battle type</div>;
  }
};

export default BattlePage;
