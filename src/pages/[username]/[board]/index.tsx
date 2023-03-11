import Board from '@components/Board'
import { getBoardBySlug } from '@lib/db/api';

export default Board

export const getServerSideProps = async (ctx : any) => {
    const { board, username } = ctx.params;
    const loading = true;
    
    const response = await getBoardBySlug(username, board);
    if (response && response.data.length > 0) {
        const board = response.data[0];
        return {
            props: {
                board,
                loading: false,
            },
        }
    } else {
        return {
            props: {
                board: null,
                loading,
            },
        }
    }
}