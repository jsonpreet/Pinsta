import Board from '@components/Board'
import { getBoardBySlug } from '@lib/db/api';

export default Board

export const getServerSideProps = async (ctx : any) => {
    const { board, username } = ctx.params;
    
    const response = await getBoardBySlug(username, board);

    return {
        props: {
            board: response ? response.data[0] : null
        },
    }
}