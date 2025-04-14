import TypingBattle from '@/components/TypingBattle';
import { useBattle } from '@/utils/StompContext';

const BattlePage = () => {
  const { battleData } = useBattle();
  console.log("Battle data in battle page: ", battleData);

  if (!battleData) return <div>Loading battle...</div>;

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
