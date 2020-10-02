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
  Loader,
  GridColumn
} from 'semantic-ui-react'

import { deleteFitness, getMyFitness, availableFitness } from '../api/fitness-api'
import Auth from '../auth/Auth'
import { Fitness } from '../types/Fitness'

interface MyFitnessProps {
  auth: Auth
  history: History
}

interface MyFitnessState {
  fitness: Fitness[]
  loadingFitness: boolean
}

export class MyFitness extends React.PureComponent<MyFitnessProps, MyFitnessState> {
  state: MyFitnessState = {
    fitness: [],
    loadingFitness: true
  }

  onEditButtonClick = (fitnessId: string) => {
    this.props.history.push(`/fitness/${fitnessId}/edit`)
  }

  onFitnessDelete = async (fitnessId: string) => {
    try {
      await deleteFitness(this.props.auth.getIdToken(), fitnessId)
      this.setState({
        fitness: this.state.fitness.filter((fitness) => fitness.fitnessId != fitnessId)
      })
    } catch {
      alert('fitness deletion failed')
    }
  }

  onAvailableButtonClick = async (fitnessId: string, pos: number) => {
    try {
      const fitnessC = this.state.fitness[pos]
      await availableFitness(this.props.auth.getIdToken(), fitnessId)
      alert(`${fitnessC.name} is available for fake walks again`)
      const fitness = this.state.fitness.map((fitness) => {
        if (fitness.fitnessId === fitnessId) {
          fitness.available = 'true'
        }
        return fitness
      })
      this.setState({
        fitness
      })
    } catch {
      alert('fitness failed')
    }
  }

  onFitnessCreate = async () => {
    this.props.history.push(`/fitness/create`)
  }

  async componentDidMount() {
    try {
      const fitness = await getMyFitness(this.props.auth.getIdToken())
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
        <Header as="h1">Are you a fitness owner? Support the community</Header>

        {this.renderCreateFitnessInput()}

        {this.renderFitness()}
      </div>
    )
  }

  renderCreateFitnessInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Button color="teal" onClick={this.onFitnessCreate}>
            Add New Fitness
          </Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
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
              <Grid.Column width={1}>{fitness.name}</Grid.Column>
              <Grid.Column width={6} floated="right">
                {fitness.description}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {fitness.available === 'false' && (
                  <Button
                    icon
                    color="green"
                    onClick={() => this.onAvailableButtonClick(fitness.fitnessId, pos)}
                  >
                    Make Available
                  </Button>
                )}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(fitness.fitnessId)}
                >
                  <Icon name="photo" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onFitnessDelete(fitness.fitnessId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <GridColumn width={4} floated="left">
                {fitness.attachmentUrl && (
                  <Image src={fitness.attachmentUrl} size="small" wrapped />
                )}
              </GridColumn>
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
