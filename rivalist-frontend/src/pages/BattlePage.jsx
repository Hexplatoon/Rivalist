import TypingBattle from '@/components/TypingBattle';
import { useAuth } from '@/utils/AuthContext';
import { useBattle, useStomp } from '@/utils/StompContext';
import { useEffect ,  } from 'react';
import { useNavigate } from 'react-router-dom';


const BattlePage = () => {
  const { battleData, updateBattleData } = useBattle();
  const { token } = useAuth();
  const { subscribeWithCleanup } = useStomp()
  const navigate = useNavigate()
  console.log("Battle data in battle page: ", battleData);

  useEffect(() => {
    if (!token) return;

    const cleanup = subscribeWithCleanup(
      "/user/topic/battle/end",
      (message) => {
        const data = JSON.parse(message.body);
        battleData.result = data.result;
        console.log("battle data: ", battleData);

        updateBattleData(battleData);
        navigate("/battleresult");
        // updateBattleData()
      }
    );

    return cleanup;
  }, [token]);

  if (!battleData) return <div>Loading battle...</div>;

  switch (battleData.category) {
    case 'TB':
      return <TypingBattle />;
    case 'CSS':
      return <CssBattle data={battleData} />;
    case 'CF':
      return <CodeforcesBattle data={battleData} />;
    default:
      return <div>Unknown battle type</div>;
  }
};

export default BattlePage;
