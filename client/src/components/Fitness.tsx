import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'
import { getAvailableFitness, fitness } from '../api/fitness-api'
import Auth from '../auth/Auth'
import { Fitness } from '../types/Fitness'

interface FitnessProps {
  auth: Auth
  history: History
}

interface FitnessState {
  fitness: Fitness[]
  loadingFitness: boolean
}

export class FitnessC extends React.PureComponent<FitnessProps, FitnessState> {
  state: FitnessState = {
    fitness: [],
    loadingFitness: true
  }

  onWalkButtonClick = async (fitnessId: string, userId: string) => {
    try {
      await fitness(this.props.auth.getIdToken(), fitnessId, userId)
      alert('Ready for your day Fitness')
      this.setState({
        fitness: this.state.fitness.filter((fitness) => fitness.fitnessId !== fitnessId)
      })
    } catch {
      alert('Fitness failed')
    }
  }

  async componentDidMount() {
    try {
      const fitness = await getAvailableFitness(this.props.auth.getIdToken())
      this.setState({
        fitness,
        loadingFitness: false
      })
    } catch (e) {
      alert(`Failed to fetch fitness: ${e.message}`)
    }
  }

  render() {
    return (
      <div>

        {this.renderFitness()}
      </div>
    )
  }

  renderFitness() {
    if (this.state.loadingFitness) {
      return this.renderLoading()
    }

    return this.renderFitnessList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Fitness
        </Loader>
      </Grid.Row>
    )
  }

  renderFitnessList() {
    return (
      <Grid padded>
        {this.state.fitness.map((fitness, pos) => {
          return (
            <Grid.Row key={fitness.fitnessId}>
              <Grid.Column width={3}>{fitness.name}</Grid.Column>
              <Grid.Column width={10} floated="right">
                {fitness.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="orange"
                  onClick={() => this.onWalkButtonClick(fitness.fitnessId, fitness.userId)}
                >
                  Walk
                </Button>
              </Grid.Column>
              {fitness.attachmentUrl && (
                <Image src={fitness.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
